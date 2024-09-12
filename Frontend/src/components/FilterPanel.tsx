import { useState, useEffect } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { CategoryInterface } from '../interfaces/ICategory';
import { BrandInterface } from '../interfaces/IBrand';
import { GetCategories, GetBrands } from '../services/http';
import './FilterPanel.css';

const { Option } = Select;

const FilterPanel = ({ onSearch }: { onSearch: (searchTerm: string, brandId?: number, categoryId?: number) => void }) => {
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [brands, setBrands] = useState<BrandInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedBrand, setSelectedBrand] = useState<number | undefined>();

    const fetchCategories = async () => {
        try {
            const res = await GetCategories();
            if (res) {
                setCategories(res);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await GetBrands();
            if (res) {
                setBrands(res);
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const handleSearch = () => {
        onSearch(searchTerm, selectedBrand, selectedCategory);
    };

    return (
        <div className="combined-filter">
            <div className="search-bar">
                <Input
                    type="text"
                    placeholder="ค้นหาด้วย ID หรือชื่อสินค้า"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onPressEnter={handleSearch}
                    className="search-input"
                />
                <Button onClick={handleSearch} className="search-button">
                    <img src="/images/icon/search.png" alt="Search icon" />
                </Button>
            </div>
            <Form layout="inline" className="filters-form">
                <Form.Item name="category" label="Category">
                    <Select
                        placeholder="Select Product Category"
                        onChange={(value) => setSelectedCategory(value ? parseInt(value) : undefined)}
                    >
                        {categories.map((item) => (
                            <Option value={item.ID?.toString()} key={item.ID}>
                                {item.CategoryName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="brand" label="Brand">
                    <Select
                        placeholder="Select Product Brand"
                        onChange={(value) => setSelectedBrand(value ? parseInt(value) : undefined)}
                    >
                        {brands.map((item) => (
                            <Option value={item.ID?.toString()} key={item.ID}>
                                {item.BrandName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FilterPanel;
