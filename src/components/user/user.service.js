const { User, Address } = require("../../../models");

const APIError = require("../../utility/APIError");
const httpStatus = require("http-status");

const { generateToken, verifyAuth } = require("../../utility/authHelper");

module.exports = class UserService {
  constructor() {}

  async createUser(payload) {
    try {
      // check user exists
      const emailExists = await User.findOne({
        where: { email: payload.email.trim() },
      });
      if (emailExists) {
        throw new APIError({
          message: "Email already exists with different account",
          status: httpStatus.CONFLICT,
        });
      }

      const result = await User.create(payload);
      try {
        payload.address.map((item) => {
          item["userId"] = result.id;
        });

        await Address.bulkCreate(payload.address);
      } catch (err) {
        await result.destroy();
        throw err;
      }
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
      };
    } catch (error) {
      throw error;
    }
  }

  async createAddress(payload, token) {
    try {
      // check user exists
      const emailExists = await User.findOne({
        where: { email: token.email.trim() },
      });
      if (!emailExists) {
        throw new APIError({
          message: "Email not exists",
          status: httpStatus.CONFLICT,
        });
      }

      payload.address.map((item) => {
        item["userId"] = token.id;
      });

      await Promise.all(
        payload.address.map(async (record) => {
          // Find or create the record based on learnerId and level
          const [existingRecord, created] = await Address.findOrCreate({
            where: {
              streetAddress: record.streetAddress,
              city: record.city,
              state: record.state,
              country: record.country,
              zipcode: record.zipcode,
            },
            defaults: record,
          });

          // If the record was not created (i.e., it already existed), update it
          if (!created) {
            await Address.update(record, {
              where: {
                id: existingRecord.id,
              },
            });
          }
        })
      );

      const address = await Address.findAll({
        where: { userId: token.id },
      });

      return {
        address: address,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id) {
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        throw new APIError({
          message: "User Not Found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginUser(credentials) {
    try {
      let user = await User.findOne({
        where: { email: credentials.email.trim() },
      });

      if (!user) {
        throw new APIError({
          message: "The entered email-id does not exist",
          status: httpStatus.UNAUTHORIZED,
        });
      }

      if (user.accessToken) {
        const verify = verifyAuth(user.accessToken);
        if (!verify) {
          let token = generateToken(
            { email: user.email, id: user.id },
            process.env.USER_JWT_EXPIRY
          );
          if (token) {
            await User.update(
              { accessToken: token },
              {
                where: {
                  id: user.id,
                },
              }
            );
          }
        }
      } else {
        let token = generateToken(
          { email: user.email, id: user.id },
          process.env.USER_JWT_EXPIRY
        );
        if (token) {
          await User.update(
            { accessToken: token },
            {
              where: {
                id: user.id,
              },
            }
          );
        }
      }

      let updatedUser = await User.findOne({
        where: { id: user.id },
        include: [
          {
            model: Address,
            as: "Addresses",
          },
        ],
      });

      return {
        accessToken: updatedUser.accessToken,
        user: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(id, token) {
    try {
      console.log(id);
      const user = await User.findOne({ where: { id } });

      await User.update(
        { accessToken: null },
        {
          where: {
            id,
          },
        }
      );

      return {
        message: "You have been Logged Out",
      };
    } catch (error) {
      throw error;
    }
  }
};
