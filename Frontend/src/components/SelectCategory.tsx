import { Form, Select } from 'antd';
import './Select.css';
import { CategoryInterface } from '../interfaces/ICategory';
import { useState, useEffect } from 'react';
import { GetCategories } from '../services/http';

const { Option } = Select;

function SelectCategory() {
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    
    const getCategories = async () => {
        try {
            const res = await GetCategories();
            if (res) {
                setCategories(res);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        getCategories(); 
    }, []); 

    return (
        <div className="SelectCate">
            <Form
                layout="inline"
                initialValues={{
                    category: ''
                }}
                onFinish={(values) => {
                    console.log('Form values:', values);
                }}
            >
                <Form.Item
                    name="category"
                    label="Category"
                >
                    <Select placeholder="Select Product Category">
                        {categories.length > 0 ? (
                            categories.map((item) => (
                                <Option value={item.ID?.toString()} key={item.ID ?? ''}>
                                    {item.CategoryName}
                                </Option>
                            ))
                        ) : (
                            <Option value="">Select Product Category</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );
}

export default SelectCategory;
