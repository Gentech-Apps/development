// export const NylasDevNewsletter = ({
//     username = 'Ram',
//     intergrationComplete = false,
//     additionalResources = [
//       {
//         title: '✉️ Mail Merge with Outlook',
//         description: 'Learn about mail merge and how to mail merge in Outlook.',
//         image: 'https://www.nylas.com/wp-content/uploads/Mail-Merge-with-Outlook.png',
//         link: 'https://www.nylas.com/blog/how-to-mail-merge-in-outlook-step-by-step/'
//       },
//       {
//         title: '???? Create a Scheduling Calendar',
//         description: 'Discover how to create an event schedule with minimal effort.',
//         image: 'https://www.nylas.com/wp-content/uploads/2023_Nylas-Scheduler-The-easiest-way-to-organize-your-events-1024x536.png',
//         link: 'https://www.nylas.com/blog/how-to-create-a-scheduling-calendar-to-organize-events-dev/'
//       }
//     ],
//     showNylasDashboardButton = true,
//   }) => (
//    <Html>
//      <Head />
//      <Preview>You're now ready to build with Nylas!</Preview>
//      <Tailwind>
//      <Body style={main}>
//        <Container style={container}>
//          <Section style={box}>
//             <Img
//               src={`${baseUrl}/static/nylas-logo.png`}
//               width="125"
//               alt="Nylas logo"
//             />
//             <Hr style={hr} />
//             <Text style={paragraph}>
//               Thanks {username} for registering with Nylas! You're now ready to build with Nylas communication APIs.
//             </Text>
//             {
//               additionalResources.length > 0 &&
//               <Text style={paragraph}>
//                 As part of your journer building with Nylas, we've put together a few resources to help you get started!
//               </Text>
//             }
//             {
//               intergrationComplete && (
//                 <Text style={paragraph}>
//                   If you haven't finished your integration, you might find our{' '}
//                   <Link style={anchor} href="https://developer.nylas.com/">
//                     docs
//                   </Link>{' '}
//                   handy.
//                 </Text>
//               )
//             }
//             { showNylasDashboardButton && (
//               <>
//                 <Button
//                 pX={10}
//                 pY={10}
//                 style={button}
//                 href="https://dashboard.nylas.com/sign-in"
//                 >
//                 View your Nylas Dashboard
//                 </Button>
//                 <Hr style={hr} />
//               </>
//             )}
//             <Heading className="text-black text-[18px] font-normal text-center p-0 my-[30px] mx-0">
//                   More resources to help you get started!
//             </Heading>
//            </Section>
//            <Section>
//               {
//                 additionalResources.map((resource) => (
//                   <Column style={{ padding: '20px' }}>
//                     <Img src={resource.image} alt={resource.title} style={contentImage}/>
//                     <Link style={paragraphContent} href={resource.link}>{resource.title}</Link>
//                     <Text style={descriptionContent}>{resource.description}</Text>
//                   </Column>
//                 ))
//               }
//            </Section>
//        </Container>
//      </Body>
//      </Tailwind>
//    </Html>
//   );
//   export default NylasDevNewsletter;
