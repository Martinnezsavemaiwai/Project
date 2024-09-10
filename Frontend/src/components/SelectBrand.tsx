import { Form, Select } from 'antd';
import './Select.css'
import { BrandInterface } from '../interfaces/IBrand';
import { useEffect, useState } from 'react';
import { GetBrands } from '../services/http';
const { Option } = Select;

function SelectBrand() {
    const [brands, setBrands] = useState<BrandInterface[]>([]);
    const getBrands = async () => {
        try {
            const res = await GetBrands();
            if (res) {
                setBrands(res);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        getBrands(); 
    }, []); 

    return (
        <div className="SelectBrand">
            <Form
                layout="inline"
                initialValues={{
                    brand: ''
                }}
                onFinish={(values) => {
                    console.log('Form values:', values);
                }}
            >
                <Form.Item
                    name="brand"
                    label="Brand"
                >
                    <Select placeholder="Select Product Brand">
                        {brands.length > 0 ? (
                            brands.map((item) => (
                                <Option value={item.ID?.toString()} key={item.ID ?? ''}>
                                    {item.BrandName}
                                </Option>
                            ))
                        ) : (
                            <Option value="">Select Product Brand</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );
}

export default SelectBrand;
