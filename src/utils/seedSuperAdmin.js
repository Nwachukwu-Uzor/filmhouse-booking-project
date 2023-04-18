import {
  superAdminEmail,
  superAdminName,
  superAdminPassword,
} from "../../config/index.js";
import { UserModel } from "../models/index.js";

export const seedSuperAdmin = async () => {
  try {
    const superAdminExists = await UserModel.findOne({
      email: superAdminEmail,
    });

    if (superAdminExists) {
      console.log("A super admin already exists");
      return;
    }

    const newSuperAdmin = await UserModel.create({
      email: superAdminEmail,
      password: superAdminPassword,
      username: superAdminName,
      emailConfirmed: true,
      roles: ["user", "admin", "superAdmin"],
    });

    if (newSuperAdmin) {
      console.log("Super Admin added successfully");
      return;
    }

    console.log("Unable to create super admin");
    4;
  } catch (error) {
    console.log(`Error Occured: ${JSON.stringify(error)}`);
  }
};
