const express = require('express');
const config = require('config');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const PORT = config.get('port') || 5000;

app.use(express.json({ extended: true }));

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }
  })
);

app.use('/uploads', express.static('uploads'));

app.use('/api/auth/', require('./routes/auth.routes'));

app.use('/api/post/', require('./routes/posts.routes'));

app.use('/api/user/', require('./routes/user.routes'));

app.use('/api/users/', require('./routes/users.routes'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
