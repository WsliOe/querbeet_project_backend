const mongoose = require('mongoose');

const hoursSchema = new mongoose.Schema({
  year: { type: String, required: true },

  Q1: {
    type: Number,
    min: 0,
  },

  Q2: {
    type: Number,
    min: 0,
  },

  Q3: {
    type: Number,
    min: 0,
  },

  Q4: {
    type: Number,
    min: 0,
  },

  totalHoursYear: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now(), select: false },
});

hoursSchema.pre('save', function (next) {
  this.Q1 = Number(this.Q1) || 0;
  this.Q2 = Number(this.Q2) || 0;
  this.Q3 = Number(this.Q3) || 0;
  this.Q4 = Number(this.Q4) || 0;

  this.totalHoursYear = this.Q1 + this.Q2 + this.Q3 + this.Q4;
  next();
});

hoursSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.year) {
    const docToUpdate = await this.model.findOne(this.getQuery()).exec();
    this._update.year = docToUpdate.year;
  }

  if (
    this._update.Q1 ||
    this._update.Q2 ||
    this._update.Q3 ||
    this._update.Q4
  ) {
    this._update.Q1 = Number(this._update.Q1) || 0;
    this._update.Q2 = Number(this._update.Q2) || 0;
    this._update.Q3 = Number(this._update.Q3) || 0;
    this._update.Q4 = Number(this._update.Q4) || 0;

    this._update.totalHoursYear =
      this._update.Q1 + this._update.Q2 + this._update.Q3 + this._update.Q4;
  }

  next();
});

const Hours = mongoose.model('Hours', hoursSchema);

module.exports = Hours;
