import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    images: [{ type: String, required: true }],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },

    address: String,

    status: {
      type: String,
      enum: ["UNSOLVED", "IN_PROGRESS", "RESOLVED"],
      default: "UNSOLVED"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    /* 🔥 AI FIELDS */
    aiSeverity: {
      label: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
      },
      score: {
        type: Number, // AI score (max 40)
        default: 0
      },
      reason: String
    },

    /* 🔥 SEVERITY SCORE BREAKDOWN */
    severityBreakdown: {
      aiScore: { type: Number, default: 0 },      // max 40
      voteScore: { type: Number, default: 0 },    // max 30
      timeScore: { type: Number, default: 0 }     // max 30
    },

    /* 🔥 FINAL COMPUTED SEVERITY (max 100) */
    severityScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

export default mongoose.model("Issue", issueSchema);
