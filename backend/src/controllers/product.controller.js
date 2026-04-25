import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  if (!title || !description || !priceAmount) {
    return res.status(400).json({
      message: "Product title, description, and price are required",
    });
  }

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
      seller: seller._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (err) {
    console.error(err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: err.message || "Failed to create product",
      success: false,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;
  try {
    const products = await productModel.find({ seller: seller._id });
    res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve products",
      success: false,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve products",
      success: false,
    });
  }
};

export const getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Product details retrieved successfully",
      success: true,
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve product details",
      success: false,
    });
  }
};

export const addProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const files = req.files;
    const images = [];
    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        })
      );
      images.push(...uploadedImages);
    }
    
    const priceAmount = Number(req.body.price);
    const priceCurrency = req.body.currency || "INR";
    const stock = Number(req.body.stock) || 0;
    const attributes = req.body.attributes ? JSON.parse(req.body.attributes) : {};

    const newVariant = {
      images,
      stock,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      attributes,
    };

    product.variants.push(newVariant);
    
    await product.save();

    res.status(201).json({
      message: "Variant added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product variant",
      success: false,
    });
  }
};
