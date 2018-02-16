'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const transactionSchema = new Schema({
  name: {type: String, enum: ['rent', 'tenant-fee', 'gas', 'electricity', 'appartment-construction', 'wifi', 'community', 'general-maintenance']},
  type: Number, // 0 >cost 1 >revenue
  date: Date,
  value: Number
});

const pictureSchema = new Schema({
  path: String,
  originalName: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
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
  location: { type: { type: String }, coordinates: [Number] },
  propertyPic: pictureSchema,
  tenants: [{
    type: ObjectId,
    ref: 'User'}],
  accountingbook: [transactionSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
);

propertySchema.index({ location: '2dsphere' });

const Prop = mongoose.model('Property', propertySchema);

module.exports = Prop;
