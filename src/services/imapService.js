const Imap = require('imap-simple');

async function connectImap({ emailType, email, appPassword }) {
  const config = {
    imap: {
      user: email,
      password: appPassword,
      host: emailType === 'gmail' ? 'imap.gmail.com' : 'outlook.office365.com',
      port: 993,
      tls: true,
      authTimeout: 3000,
    }
  };
  return await Imap.connect(config);
}

async function fetchUnreadEmails({ emailType, email, appPassword }) {
  const connection = await connectImap({ emailType, email, appPassword });
  await connection.openBox('INBOX');
  const searchCriteria = ['UNSEEN'];
  const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], markSeen: false };
  const results = await connection.search(searchCriteria, fetchOptions);

  const emails = results.map(res => {
    const header = res.parts.find(part => part.which.startsWith('HEADER')).body;
    const text = res.parts.find(part => part.which === 'TEXT').body;
    return {
      from: header.from && header.from[0],
      to: header.to && header.to[0],
      subject: header.subject && header.subject[0],
      date: header.date && header.date[0],
      text
    };
  });

  connection.end();
  return emails;
}

module.exports = { fetchUnreadEmails };
