import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      maxlength: 50
    },
    instituteName: {
      type: String
    },
    rollNumber: {
      type: String
    },
    joiningYear: {
      type: Number
    },
    email: {
      institute: {
        type: String,
        trim: true,
        unique: 1
      },
      personal: {
        type: String,
        trim: true,
        unique: 1
      }
    },
    hash_password: {
      type: String,
      minlength: 8
    },
    contact: {
      type: Number
      // required: true
    },
    headline: {
      type: String
    },
    about: {
      type: String
    },

    //Base-64 encoded display picture
    dp: {
      profile: String,
      cover: String
    },

    //Social Media handles
    socialHandle: {
      twitter: {
        type: String
      },
      facebook: {
        type: String
      },
      instagram: {
        type: String
      },
      linkedin: {
        type: String
      },
      gitHub: {
        type: String
      },
      discord: {
        type: String
      }
    },

    converations: [
      {
        conversationID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Conversations'
        }
      }
    ]
  },
  { timestamps: true }
);

userSchema.virtual('password').set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  }
};

const Users = mongoose.model('user', userSchema);
export default Users;
