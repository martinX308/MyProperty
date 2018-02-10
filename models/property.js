'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const transactionSchema = new Schema({
  type: {type: String, enum: ['rent', 'tentantFee', 'gas', 'electricity', 'appartment-construction', 'wifi', 'community', 'general-maintenance']},
  date: Date,
  value: Number
});

const propertySchema = new Schema({
  name: String,
  street: String,
  nr: String,
  zip: String,
  city: String,
  country: String,
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  accountingbook: [transactionSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
);

const Prop = mongoose.model('Property', propertySchema);

module.exports = Prop;
