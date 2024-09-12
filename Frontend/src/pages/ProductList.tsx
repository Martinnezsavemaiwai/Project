import { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Layout, { Content } from 'antd/es/layout/layout';
import { apiUrl, DeleteProductByID, ListProducts } from '../services/http';
import { ProductInterface } from '../interfaces/IProduct';
import { ImageInterface } from '../interfaces/IImage';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox'; 
import '../components/ProductListPage.css';
import SelectBrand from '../components/SelectBrand';
import SelectCategory from '../components/SelectCategory';

function ProductList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>([]); 
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | undefined>();

    const getProducts = async () => {
        const resProduct = await ListProducts();
        if (resProduct) {
            setProducts(resProduct);
            setFilteredProducts(resProduct);  // Initially, all products are displayed
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price) + '฿';
    };

    const handleEdit = (id: number) => {
        navigate(`/Product/Edit/${id}`);
    };

    const handleDelete = (id: number) => {
        const product = products.find(p => p.ID === id);
        setModalText(`คุณต้องการลบสินค้าชื่อ "${product?.ProductName}" หรือไม่ ?`);
        setDeleteId(id);
        setModalVisible(true);
    };

    const handleOk = async () => {
        if (deleteId === undefined) {
            message.error("Invalid product ID.");
            return;
        }

        setConfirmLoading(true);
        try {
            const res = await DeleteProductByID(deleteId);
            if (res) {
                setModalVisible(false);
                message.success("ลบข้อมูลสำเร็จ");
                getProducts();
            } else {
                message.error("เกิดข้อผิดพลาด !");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            message.error("Error deleting product.");
        }
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
    };
    
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };
    
    const handleSearch = (searchTerm: string) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        // Check if searchTerm is a number
        const isNumeric = !isNaN(Number(searchTerm));
    
        const filtered = products.filter(product => {
            if (isNumeric) {
                // Search by ID if searchTerm is a number
                return product.ID === Number(searchTerm);
            } else {
                // Search by ProductName if searchTerm is a string
                return product.ProductName?.toLowerCase().includes(lowerSearchTerm);
            }
        });
    
        // Filter by selected BrandID and CategoryID
        const filteredByBrandAndCategory = filtered.filter(product => {
            const matchesBrand = selectedBrand ? product.BrandID === Number(selectedBrand) : true;
            const matchesCategory = selectedCategory ? product.CategoryID === Number(selectedCategory) : true;
            return matchesBrand && matchesCategory;
        });
    
        if (filteredByBrandAndCategory.length === 0) {
            Modal.warning({
                title: 'ไม่พบสินค้า',
                content: 'ไม่พบสินค้าที่คุณค้นหาด้วย ID หรือชื่อสินค้า โปรดลองใหม่อีกครั้ง',
                className: 'custom-modal',
                onOk: () => {
                    setLoading(true); 
                    setTimeout(() => {
                        setFilteredProducts(products); 
                        setLoading(false); 
                    }, 1250); 
                },
            });
        } else {
            setFilteredProducts(filteredByBrandAndCategory);
        }
    };
    
    



    const columns: ColumnsType<ProductInterface> = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            align: 'center',
        },
        {
            title: 'Image',
            dataIndex: 'Images',
            key: 'Image',
            align: 'center',
            render: (images: ImageInterface[]) => {
                const imageFilePath = images && images.length > 0 ? images[0].FilePath : '';
                return imageFilePath ? (
                    <img src={`${apiUrl}/${imageFilePath}`} alt="Product" style={{ maxWidth: '100px', height: 'auto' }} />
                ) : 'No Image';
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'ProductName',
            key: 'ProductName',
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            align: 'center',
        },
        {
            title: 'Price',
            dataIndex: 'PricePerPiece',
            key: 'Price',
            align: 'center',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Stock',
            dataIndex: 'Stock',
            key: 'Stock',
            align: 'center',
        },
        {
            title: 'Brand',
            dataIndex: 'Brand',
            key: 'Brand',
            align: 'center',
            render: (brand) => brand?.BrandName || 'N/A',
        },
        {
            title: 'Category',
            dataIndex: 'Category',
            key: 'Category',
            align: 'center',
            render: (category) => category?.CategoryName || 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (record: ProductInterface) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record?.ID ?? 0)} type="primary">Edit</Button>
                    <Button onClick={() => handleDelete(record?.ID ?? 0)} danger>Delete</Button>                
                </Space>
            )
        },
    ];

    return (
        <>
            <Header page={undefined} />
            <Layout className="my-layout1">
                <Content style={{ padding: '0 20px', marginTop: '20px' }}>
                    <SearchBox onSearch={handleSearch} />
                    <span className='brand-category-filter'>
                        <SelectBrand onBrandChange={handleBrandChange} />
                        <SelectCategory onCategoryChange={handleCategoryChange} />
                    </span>
                    {loading ? (
                        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
                    ) : (
                        <Table
                            dataSource={filteredProducts}
                            columns={columns}
                            pagination={false}
                            bordered
                            rowKey="ID"
                            className="product-table"
                        />
                    )}
                </Content>
            </Layout>
            <Modal
                title="ยืนยันการลบสินค้า"
                open={modalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                className="custom-modal2"
                footer={[
                    <Button key="cancel" onClick={handleCancel} className="custom-cancel-button">
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk} className="custom-ok-button">
                        OK
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>
        </>
    );
}

export default ProductList;
