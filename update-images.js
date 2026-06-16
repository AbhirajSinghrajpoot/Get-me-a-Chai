const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chai_v2').then(async () => {
  const result = await mongoose.connection.db.collection('users').updateOne(
    { username: 'abhirajsingh2k5' },
    { $set: { profilepic: '/profile.png', coverpic: '/cover.png', updatedAt: new Date() } }
  );
  console.log('Updated chai_v2:', result.modifiedCount, 'document(s)');

  // Also verify what users exist
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('All users:', JSON.stringify(users.map(u => ({ username: u.username, profilepic: u.profilepic, coverpic: u.coverpic })), null, 2));
  await mongoose.disconnect();
});
