const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/HappyHoeDb')
    .then(() => {
        console.log('mongodb connected')
    })
    .catch(() => {
        console.log('mongodb failed to connect')
    })

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['manager', 'agent'],
        required: true
    },
    branch: {
        type: String,
        enum: ['Matugga', 'Maganjo'],
        required: true
    }
})

const salesSchema = new mongoose.Schema({
    buyerName: String,
    salesAgentName: String,
    saleDate: {
        type: Date,
        required: true
    },
    saleType: {
        type: String,
        enum: ['cash', 'credit'],
        required: true
    },
    produceName: String,
    tonnage: Number,
    amountPaid: {
        type: Number,
        min: [10000, 'Amount paid must be at least 10,000 UGX'],
        required: function() { return this.saleType === 'cash'; }
    },
    amountDue: {
        type: Number,
        required: function() { return this.saleType === 'credit'; }
    },
    contacts: {
        type: String,
        required: function() { return this.saleType === 'credit'; }
    },
    dateOfDispatch: {
        type: Date,
        required: function() { return this.saleType === 'credit'; }
    },
    dueDate: {
        type: Date,
        required: function() { return this.saleType === 'credit'; }
    },
    location: {
        type: String,
        required: function() { return this.saleType === 'credit'; },
        minlength: 2
    },
    nationalId: {
        type: String,
        required: function() { return this.saleType === 'credit'; },
        validate: {
            validator: function(v) {
                return /^(CM|CF|PM)[A-Z0-9]{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid National ID. It must be 14 characters long and start with CM, CF, or PM.`
        },
        set: v => v.toUpperCase() // Convert to uppercase before saving
    }
});

const procurementSchema = new mongoose.Schema({
    produceName: String,
    dealerName: String,
    Type: String,
    Cost: Number,
    Date: Date,
    BranchName: String,
    Time: String,
    Tonnage: Number,
    phone: String
});

const creditSaleSchema = new mongoose.Schema({
    buyerName: { type: String, required: true },
    salesAgentName: { type: String, required: true },
    saleDate: { type: Date, required: true },
    produceName: { type: String, required: true },
    tonnage: { type: Number, required: true },
    amountDue: { type: Number, required: true },
    contacts: { type: String, required: true },
    dateOfDispatch: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    location: { type: String, required: true },
    nationalId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const procurement = mongoose.model("procurement", procurementSchema);

const Sales = mongoose.model('Sales', salesSchema);

const collection = new mongoose.model('Collection', loginSchema)

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    tonnage: { type: Number, default: 0 },
    imageUrl: String
});

const Product = mongoose.model('Product', productSchema);

const CreditSale = mongoose.model('CreditSale', creditSaleSchema);

module.exports = { collection, Sales, procurement, Product, CreditSale };