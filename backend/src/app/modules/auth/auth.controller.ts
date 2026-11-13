import { Request, Response } from "express";
import { User } from "./auth.model";
import { firebaseAdminAuth } from "../../config/firebase-admin";

const PHONE_REGEX = /^\+91[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECENT_LOGIN_SECONDS = 5 * 60;

export const syncUser = async (req: Request, res: Response) => {
  try {
    // Firebase UID comes ONLY from verified token
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const email = req.user?.email || "";
    const tokenPhone = req.user?.phone || "";

    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

    const bodyPhone =
      typeof req.body?.phone === "string" ? req.body.phone.trim() : "";

    // Validate name
    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name is too long",
      });
    }

    // Validate body phone
    if (bodyPhone && !PHONE_REGEX.test(bodyPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    // Firebase verified phone has priority
    const phone = tokenPhone || bodyPhone;

    const updateData: Record<string, string> = {};

    if (email) {
      updateData.email = email;
    }

    if (phone) {
      updateData.phone = phone;
    }

    if (name) {
      updateData.name = name;
    }

    const user = await User.findOneAndUpdate(
      {
        firebaseUid: uid,
      },
      {
        $setOnInsert: {
          firebaseUid: uid,
        },

        ...(Object.keys(updateData).length
          ? {
              $set: updateData,
            }
          : {}),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    console.error("syncUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findOne({
      firebaseUid: uid,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Require a recent password confirmation (login within the last 5 minutes)
    const token = (req.headers.authorization || "")
      .replace("Bearer ", "")
      .trim();
    const decoded = await firebaseAdminAuth.verifyIdToken(token);
    const secondsSinceLogin =
      Math.floor(Date.now() / 1000) - Number(decoded.auth_time || 0);

    if (!decoded.auth_time || secondsSinceLogin > RECENT_LOGIN_SECONDS) {
      return res.status(403).json({
        success: false,
        message: "Please confirm your password again and retry",
      });
    }

    // Only email + password accounts can change their email
    const firebaseUser = await firebaseAdminAuth.getUser(uid);
    const hasPassword = firebaseUser.providerData.some(
      (provider) => provider.providerId === "password",
    );

    if (!hasPassword) {
      return res.status(400).json({
        success: false,
        message: "Email can only be changed for email accounts",
      });
    }

    // Update Firebase (login email) and MongoDB together
    await firebaseAdminAuth.updateUser(uid, { email, emailVerified: false });

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $setOnInsert: { firebaseUid: uid },
        $set: { email },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: user,
    });
  } catch (error) {
    const code = (error as { code?: string })?.code;

    if (code === "auth/email-already-exists") {
      return res.status(409).json({
        success: false,
        message: "This email is already used by another account",
      });
    }

    if (code === "auth/invalid-email") {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    console.error("updateEmail error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update email",
    });
  }
};
