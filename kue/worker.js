const { Op } = require("sequelize");
const { models } = require("../models");
const email = require("../routes/email/email");

const worker = async () => {
  try {
    // find all customers who have to be reminded
    const customers = await models.Customer.findAll({
      where: {
        to_remind: {
          [Op.lte]: new Date(),
        },
      },
    });
    // loop through the customer
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i].dataValues;
      // console.log(customer);
      const customerEmail = customer.email;
      // get the user associated with the customer
      const user = await models.User.findOne({
        where: {
          id: customer.userId,
        },
      });
      const userEmail = user.dataValues.email;
      // console.log(customerEmail, userEmail);
      // call emailAnd Update function
      await emailAndUpdate(
        customer.id,
        user.dataValues.id,
        customerEmail,
        userEmail
      );
      // get the reminder frequency
      const reminder_frequency = customer.reminder_frequency;
      // update the to_remind date
      await models.Customer.update(
        {
          to_remind: new Date(
            Date.now() + reminder_frequency * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          where: {
            userId: user.dataValues.id,
          },
        }
      );
    }
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
};

const emailAndUpdate = async (customerId, userId, customerEmail, userEmail) => {
  // get all the communications between user and customer which is not yet updated
  let communications = await models.Communication.findAll({
    where: {
      userId,
      customerId,
      notified: false,
    },
    order: ["time"],
  });
  // console.log(communications);
  let summary = [];
  // loop through the communications and add to summary
  for (let i = communications.length - 1; i >= 0; i--) {
    let communication = communications[i].dataValues;
    let data = {
      title: communication.title,
      description: communication.description,
      time: communication.time,
    };
    summary.push(data);
  }
  // udate all the communications between user and customer(notified becomes true)
  await models.Communication.update(
    { notified: true },
    {
      where: {
        userId,
        customerId,
      },
    }
  );
  if (summary.length > 0) {
    // send email to customer
    email(
      customerEmail,
      `communication summary with @${userEmail}`,
      JSON.stringify(summary)
    );
    // send email to customer
    email(
      userEmail,
      `communication summary with @${customerEmail}`,
      JSON.stringify(summary)
    );
  }
};

module.exports = worker;
