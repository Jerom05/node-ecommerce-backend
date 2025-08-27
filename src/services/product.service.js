import _ from 'lodash';
import slugify from 'slugify';

import { Product, Category } from '../models/index.js';

import { clodinaryService } from './index.js';

export const createProduct = async (req, res, session) => {
  let productData;
  let uploadedIds = [];
  try {
    productData = _.pick(req.body, [
      'title',
      'description',
      'category_id',
      'price',
      'stock',
    ]);

    const category = await Category.findById(productData.category_id);
    if (!category) throw new Error('Category not found');

    const slug = slugify(req.body.title).toLowerCase();
    productData.slug = slug;

    const existingProduct = await Product.findOne({ slug }, null, { session });
    if (existingProduct) {
      throw new Error('Product with the same title already exists');
    }

    if (req.files) {
      const { thumbnail, product_images, uploaded_ids } =
        await uploadproductImages(req.files);

      uploadedIds = uploaded_ids;
      productData.thumbnail = thumbnail;
      productData.product_images = product_images;
    }

    const product = new Product(productData);
    await product.save({ session });

    res.status(201).json({
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    if (uploadedIds.length > 0)
      await clodinaryService.deleteImages(uploadedIds);
    throw error;
  }
};

const uploadproductImages = async (files = {}) => {
  let thumbnail = null;
  let product_images = [];
  let uploaded_ids = [];
  try {
    if (files.thumbnail?.[0]) {
      const result = await clodinaryService.uploadToCloudinary(
        files.thumbnail[0].buffer,
        'ecom/thumbnails'
      );
      uploaded_ids.push(result.public_id);
      thumbnail = { url: result.secure_url, public_id: result.public_id };
    }

    // Upload product feature images in parallel
    product_images = await Promise.all(
      (files.product_feature_images || []).map(async (file) => {
        const result = await clodinaryService.uploadToCloudinary(
          file.buffer,
          'ecom/product_images'
        );
        uploaded_ids.push(result.public_id);
        return { url: result.secure_url, public_id: result.public_id };
      })
    );

    return { thumbnail, product_images, uploaded_ids };
  } catch (error) {
    console.error('Image upload failed:', error.message);
    if (uploaded_ids.length > 0)
      await clodinaryService.deleteImages(uploaded_ids);
    throw error;
  }
};

export const updateProduct = async (req, res, session) => {
  const { id } = req.params;
  const productData = _.pick(req.body, [
    'title',
    'category_id',
    'description',
    'price',
    'stock',
    'stock_change',
  ]);

  const product = await Product.findById(id);
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }

  if (productData.category_id) {
    const category = await Category.findById(
      productData.category_id.toString()
    );
    if (!category) throw new Error('Category not found');
  }

  if (productData.title) {
    const slug = slugify(req.body.title).toLowerCase();
    const existingProduct = await Product.findOne({ slug }, null, { session });

    if (existingProduct && existingProduct._id.toString() !== id)
      throw new Error('Product with the same title already exists');
    else productData.slug = slug;
  }

  if (productData.stock && productData.stock_change) {
    throw new Error('Provide either stock or stock_change');
  }

  if (productData.stock_change) {
    productData.stock =
      (product.stock || 0) + parseInt(productData.stock_change, 10);
    delete productData.stock_change;
  }

  product.set(productData);
  await product.save({ session });

  res.json({ message: 'Product updated successfully', data: product });
};

export const deleteProduct = async (req, res, session) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id }, { session });
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }

  const { thumbnail, product_images } = product;
  const public_ids = [
    thumbnail?.public_id,
    ...product_images?.map((image) => image.public_id),
  ];
  if (public_ids.length > 0) await clodinaryService.deleteImages(public_ids);

  res.json({ message: 'Product deleted successfully' });
};

export const addProductImages = async (req, res, session) => {
  let new_uploaded_ids = [];
  try {
    const { id: _id } = req.params;
    const product = await Product.findOne({ _id }, null, { session });
    if (!product) throw new Error(`Product with ID ${_id} not found`);

    const { product_images, uploaded_ids } = await uploadproductImages(
      req.files
    );
    new_uploaded_ids = uploaded_ids;

    product.product_images = [...product.product_images, ...product_images];

    await product.save({ session });

    res.json({
      message: 'Product image added successfully',
      data: product.product_images,
    });
  } catch (error) {
    console.error('Error adding product image:', error.message);
    if (new_uploaded_ids.length > 0)
      await clodinaryService.deleteImages(new_uploaded_ids);
    throw error;
  }
};

export const removeProductImage = async (req, res, session) => {
  const { id: _id } = req.params;
  const { public_ids = [] } = req.body;
  const product = await Product.findOne({ _id }, null, { session });
  if (!product) throw new Error(`Product with ID ${_id} not found`);

  const { product_images } = product;
  const updated_product_images = product_images.filter(
    (image) => !public_ids.includes(image.public_id)
  );

  await Product.updateOne(
    { _id },
    { product_images: updated_product_images },
    { session }
  );

  await clodinaryService.deleteImages(public_ids);

  res.json({
    message: 'Product image deleted successfully',
    data: updated_product_images,
  });
};

export const changeProductThumbnail = async (req, res, session) => {
  const { id: _id } = req.params;
  const product = await Product.findOne({ _id }, null, { session });
  if (!product) throw new Error(`Product with ID ${_id} not found`);

  const new_thumbnail = await clodinaryService.uploadToCloudinary(
    req.file?.buffer,
    'ecom/thumbnails'
  );

  const { public_id } = product.thumbnail;
  product.thumbnail = {
    url: new_thumbnail.secure_url,
    public_id: new_thumbnail.public_id,
  };
  await product.save({ session });
  if (public_id) await clodinaryService.deleteImage(public_id);

  res.json({
    message: 'Product thumbnail updated successfully',
    data: product.thumbnail,
  });
};

export const removeProductThumbnail = async (req, res, session) => {
  const { id: _id } = req.params;
  const product = await Product.findOne({ _id }, null, { session });
  if (!product) throw new Error(`Product with ID ${_id} not found`);

  const { thumbnail } = product;
  if (!thumbnail) throw new Error('Product thumbnail not found');

  await Product.updateOne({ _id }, { thumbnail: null }, { session });
  await clodinaryService.deleteImage(thumbnail.public_id);

  res.json({ message: 'Product thumbnail deleted successfully' });
};
