import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

// Helper to save base64 image
const saveBase64Image = (base64Str, userId) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  let extension = 'png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
  else if (mimeType.includes('webp')) extension = 'webp';

  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `avatar_${userId}_${Date.now()}.${extension}`;
  const filepath = path.join(uploadsDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  
  return `/uploads/${filename}`;
};

// @desc    Update user profile details
// @route   PUT /api/user/update
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.clinicName = req.body.clinicName || user.clinicName;
      user.gstin = req.body.gstin || user.gstin;

      // Handle profile image upload from base64
      if (req.body.profileImage) {
        if (req.body.profileImage.startsWith('data:image/')) {
          const relativePath = saveBase64Image(req.body.profileImage, user._id);
          if (relativePath) {
            const host = req.get('host');
            const protocol = req.protocol;
            user.profileImage = `${protocol}://${host}${relativePath}`;
          }
        } else {
          user.profileImage = req.body.profileImage;
        }
      }

      // Handle updating the password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        clinicName: updatedUser.clinicName,
        gstin: updatedUser.gstin,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update profile server error' });
  }
};
