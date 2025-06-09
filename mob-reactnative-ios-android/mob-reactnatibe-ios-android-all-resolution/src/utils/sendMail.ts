// // import nodemailer from 'nodemailer';

// // export const sendEmail = async (to: string, subject: string, text: string) => {
// //   // Create a transporter using the default SMTP transport
// //   const transporter = nodemailer.createTransport({
// //     service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
// //     auth: {
// //       user: 'canteen@genesistechnologies.in',
// //       pass: 'Genesis@1234#',
// //     },
// //   });

// //   // Setup email data
// //   const mailOptions: nodemailer.SendMailOptions = {
// //     from: 'canteen@genesistechnologies.in',
// //     to,
// //     subject,
// //     text,
// //   };

// //   // Send the email
// //   try {
// //     await transporter.sendMail(mailOptions);
// //     console.log('Email sent successfully');
// //   } catch (error) {
// //     console.error('Email not sent:', error);
// //   }
// // };

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

//import Mailer from 'react-native-mail';
import email from 'react-native-email';

export const sendEmail = async () => {
  //to: string, subject: string, text: string

  // Mailer.mail({
  //   subject: 'need help',
  //   recipients: ['sushmita.soni@genesistechnologies.in'],
  // //   ccRecipients: ['supportCC@example.com'],
  // //   bccRecipients: ['supportBCC@example.com'],
  //   body: '<b>A Bold Body</b>',
  //   customChooserTitle: 'This is my new title', // Android only (defaults to "Send Mail")
  //   isHTML: true,
  //   attachments: [{
  //     // Specify either `path` or `uri` to indicate where to find the file data.
  //     // The API used to create or locate the file will usually indicate which it returns.
  //     // An absolute path will look like: /cacheDir/photos/some image.jpg
  //     // A URI starts with a protocol and looks like: content://appname/cacheDir/photos/some%20image.jpg
  //     path: '', // The absolute path of the file from which to read data.
  //     uri: '', // The uri of the file from which to read the data.
  //     // Specify either `type` or `mimeType` to indicate the type of data.
  //     type: '', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
  //     mimeType: '', // - use only if you want to use custom type
  //     name: '', // Optional: Custom filename for attachment
  //   }]
  // }, (error, event) => {
  //     console.log(error);
  // });

  const to = ['sushmita.soni@genesistechnologies.in']; // string or array of email addresses
  email(to, {
    // Optional additional arguments
    cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
    bcc: 'mee@mee.com', // string or array of email addresses
    subject: 'Show how to use',
    body: 'Some body right here',
    checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
  }).catch(console.error);
};

// // send-email.js
// import qs from 'qs';
// import { Linking } from 'react-native';

// export async function sendEmail(to :  string, subject : string, body : string, options = {}) {
//     // const { cc, bcc } = options;

//     let url = `mailto:${to}`;

//     // Create email link query
//     const query = qs.stringify({
//         subject: subject,
//         body: body,
//         // cc: cc,
//         // bcc: bcc
//     });

//     if (query.length) {
//         url += `?${query}`;
//     }

//     console.log("Sushmita ",url);
//     // check if we can use this link
//     const canOpen = await Linking.canOpenURL(url);

//     if (!canOpen) {
//         throw new Error('Provided URL can not be handled eee');
//     }

//     return Linking.openURL(url);
// }
