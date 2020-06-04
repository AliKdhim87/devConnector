const config = require('config');

const sendGridApiKey = config.get('SEND_GRID_API_KEY');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridApiKey);
// const HttpError = require('../model/http-error');

const template = (name, firstText, linkPath, secondText, linkText) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossorigin="anonymous"
      />
      <title>Dev Connector App</title>
    </head>
    <body>
      <div class="container">
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4 text-center">Dev Connector</h1>
          </div>
        </div>
        <section style="height: 40vh;">
          <h4 class="text-center">Hello ${name}</h4>
          <div class="bg-light p-3">
            <p class="lead">
              ${firstText}
            </p>
            <a href="${linkPath}" class="btn btn-dark">${linkText}</a>
            <div class="dropdown-divider"></div>
            <p>
              ${secondText}
            </p>
          </div>
        </section>
      </div>
    </body>
  </html>
  `;
};

const forgetPasswordEmail = async (name, email, link) => {
  const mailOptions = {
    to: email,
    from: 'bsilakaymak@gmail.com',
    name: 'YourPlaces',
    subject: 'Password change request',
    html: template(
      name,
      `Please click on the following link to reset your password.`,
      link,
      ` If you did not request this, please ignore this email and your password will remain unchanged.`,
      `Click to Change Your Password`
    ),
    text: `Hello ${name} \n 
       Please click on the following link ${link} to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const resetPasswordEmail = async (name, email) => {
  const mailOptions = {
    to: email,
    from: 'bsilakaymak@gmail.com',
    subject: 'Your password has been changed',
    html: template(
      name,
      `This is a confirmation that the password for your account ${email} has just been changed.`,
      `http://placesharer.herokuapp.com`,
      ` `,
      `Go to App`
    ),
    text: `Hello ${name} \n 
          This is a confirmation that the password for your account ${email} has just been changed.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const friendAddedNotification = async (name, person, email) => {
  const mailOptions = {
    to: email,
    from: 'yourplaces.hyf@gmail.com',
    subject: 'You have a new friend request',
    text: `Hello ${name} \n 
           ${person} wants to be your friend \n`,
    html: template(
      name,
      `${person} wants to be your friend`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    )
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const friendAcceptedNotification = async (name, person, email) => {
  const mailOptions = {
    to: email,
    from: 'yourplaces.hyf@gmail.com',
    subject: 'Your friend request is accepted',
    html: template(
      name,
      `You are now friends with ${person}`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `Hello ${name} \n 
          You are now friends with ${person}\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const likeNotification = async (name, person, post, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone liked your post',
    html: template(
      name,
      `${person} liked your post ${post}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person} liked your post ${post}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const emojiNotification = async (name, person, post, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone add emoji to your post',
    html: template(
      name,
      `${person} add emoji to your post ${post}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  add emoji to your post ${post}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const addCommentNotification = async (name, person, post, email, comment) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone add comment to your post',
    html: template(
      name,
      `${person} add <strong>${comment}</strong> comment to your post ${post}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  add comment to your post ${post}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};
const addCommentEmojiNotification = async (name, person, comment, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone add emoji to your comment',
    html: template(
      name,
      `${person} add emoji to your comment ${comment}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  add emoji to your comment ${comment}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const JoinedGroupNotification = async (name, person, group, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone joined in your Group',
    html: template(
      name,
      `${person} joined in your Group ${group}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  joined in your Group${group}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const leftGroupNotification = async (name, person, group, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone left your Group',
    html: template(
      name,
      `${person} left your Group ${group}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  left your Group${group}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const deleteGroupNotification = async (name, owner, group, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Deleted Group!',
    html: template(
      name,
      `${owner} deleted Group ${group}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${owner}  deleted Group${group}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const addPostGroupNotification = async (name, personAddPost, group, email) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: `Someone add post on group ${group} `,
    html: template(
      name,
      `${personAddPost} add post on group ${group}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${personAddPost} add post on group ${group}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const addEventGroupNotification = async (
  name,
  personAddEvent,
  group,
  email,
  startTime,
  endTime,
  eventTitle
) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: `Someone add Event on group ${group} `,
    html: template(
      name,
      `${personAddEvent} add an event ${eventTitle} on group ${group}. It will start from ${startTime} to ${endTime}`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: ` Hello ${name}, 
    ${personAddEvent} add event ${eventTitle} on group ${group}
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const addCommentGroupNotification = async (
  name,
  person,
  group,
  email,
  post,
  comment
) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone add comment to your post',
    html: template(
      name,
      `${person} add <strong>${comment}</strong> comment to your post ${post} in ${group} group`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  add comment to your post ${post} in ${group} group
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const addEmojiPostGroupNotification = async (
  name,
  person,
  group,
  email,
  post
) => {
  const mailOptions = {
    to: email,
    from: 'aboal7anan@gmail.com',
    subject: 'Someone add emoji to your post',
    html: template(
      name,
      `${person} add emoji to your ${post} post in ${group} group`,
      `http://localhost:3000`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `   Hello ${name}, 
    ${person}  add $ emoji to your ${post} post in ${group} group
    If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

const friendSharedPlace = async (friend, place, emails) => {
  const mailOptions = {
    to: emails,
    from: 'bsilakaymak@gmail.com',
    name: 'YourPlaces',
    subject: 'Your friend shared a new place',
    html: template(
      `!`,
      `Your friend ${friend} shared a new place : ${place}`,
      `http://placesharer.herokuapp.com`,
      `If you do not want to receive e-mail notifications, you can disable it on your profile page.`,
      `Go to App`
    ),
    text: `Hello! \n 
       Your friend ${friend} shared a new place : ${place} \n\n 
       If you do not want to receive e-mail notifications, you can disable it on your profile page.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    throw error.message;
  }
};

module.exports = {
  forgetPasswordEmail,
  resetPasswordEmail,
  friendAddedNotification,
  friendAcceptedNotification,
  likeNotification,
  friendSharedPlace,
  emojiNotification,
  addCommentNotification,
  addCommentEmojiNotification,
  JoinedGroupNotification,
  leftGroupNotification,
  deleteGroupNotification,
  addPostGroupNotification,
  addEventGroupNotification,
  addCommentGroupNotification,
  addEmojiPostGroupNotification
};
