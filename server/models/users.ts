import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UsersDoc extends mongoose.Document {
  fullName?: String;
  isVerified?: Boolean;
  isVerifiedStudent?: Boolean;
  instituteName?: String;
  rollNumber?: String;
  joiningYear?: Number;
  email?: {
    institute?: String;
    personal?: String;
  };
  otp?: {
    institute?: {
      value: Number;
      expire_time: Number;
    };
    personal?: {
      value?: Number;
      expire_time?: Number;
    };
  };
  password?: String;
  hash_password?: String;
  contact?: Number;
  headline?: String;
  about?: String;
  dp?: {
    profile: String;
    cover: String;
  };
  socialHandle?: {
    twitter: String;
    facebook: String;
    instagram: String;
    linkedin: String;
    gitHub: String;
    discord: String;
  };
  converations?: [
    {
      conversationID: mongoose.Schema.Types.ObjectId;
    }
  ];
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isVerifiedStudent: {
      type: Boolean,
      default: false
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
        index: true,
        unique: true,
        sparse: true
      },
      personal: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true
      }
    },
    otp: {
      institute: {
        value: {
          type: Number
        },
        expire_time: {
          type: Number
        }
      },
      personal: {
        value: {
          type: Number
        },
        expire_time: {
          type: Number
        }
      }
    },
    hash_password: {
      type: String,
      minlength: 8
    },
    contact: {
      type: Number,
      // required: true
      index: true,
      unique: true,
      sparse: true
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

const Users = mongoose.model<UsersDoc>('user', userSchema);
export default Users;
