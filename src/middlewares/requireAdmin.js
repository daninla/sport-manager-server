import db from "../database/models/index.js";

const { UserRole, Role } = db;
const maxUserId = 2147483647;

export async function requireAdmin(req, res, next) {
  // res.set("Cache-Control", "no-store");

  // // The authentication middleware supplies the verified user ID.
  // const id = req.user?.id;
  // const userId = typeof id === "string" && /^\d+$/.test(id) ? Number(id) : id;
  // if (!Number.isInteger(userId) || userId < 1 || userId > maxUserId) {
  //   return res.status(401).json({ message: "Authentication required" });
  // }

  // const origin = req.get("Origin");
  // if (
  //   !["GET", "HEAD"].includes(req.method) &&
  //   origin &&
  //   origin !== req.app.locals.clientOrigin
  // ) {
  //   return res.status(403).json({ message: "Request origin not allowed" });
  // }

  // const role = await UserRole.findOne({
  //   attributes: ["userId"],
  //   where: { userId },
  //   include: [{
  //     model: Role,
  //     attributes: [],
  //     where: { title: "admin" },
  //     required: true,
  //   }],
  //   raw: true,
  // });
  // if (!role) {
  //   return res.status(403).json({ message: "Administrator access required" });
  // }

  next();
}
