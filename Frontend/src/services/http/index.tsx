import { ImageInterface } from "../../interfaces/IImage";
import { ProductInterface } from "../../interfaces/IProduct";

export const apiUrl = "http://localhost:8000";

async function CreateProduct(data: ProductInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/products`, requestOptions)
        .then((res) => {
            if (res.status == 201) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function ListProducts() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/products`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetProductByID(productID: number): Promise<ProductInterface | false> {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(`${apiUrl}/products/${productID}`, requestOptions);
        
        if (response.status === 200) {
            const productData: ProductInterface = await response.json();
            return productData;
        } else {
            console.error(`Failed to fetch product. Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('An error occurred while fetching the product:', error);
        return false;
    }
}


async function UpdateProduct(id: number, data: ProductInterface) {
    if (id === undefined) {
        throw new Error("Product ID is undefined");
    }

    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/products/${id}`, requestOptions)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                console.error("Failed to update product:", res.status, res.statusText);
                return false;
            }
        });

    console.log("Product update response:", res);
    return res;
}




async function DeleteProductByID(id: number) {
    if (!id) {
        console.error('Product ID is required to delete');
        return false;
    }

    const requestOptions = {
        method: "DELETE"
    };

    try {
        const res = await fetch(`${apiUrl}/products/${id}`, requestOptions);
        return res.status === 200;
    } catch (error) {
        console.error('Error occurred while deleting product:', error);
        return false;
    }
}



async function GetBrands() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/brands`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}


async function GetCategories() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/categories`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function GetOwner() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/owners`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });     

    return res; 
}   

async function GetOwnerById(id: Number | undefined) {
    const requestOptions = {
        method: "GET"
    };

    let res = await fetch(`${apiUrl}/owners/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function ListImages() {
    try {
        const response = await fetch(`${apiUrl}/images`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch images:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        return false;
    }
}


async function GetImageByProductID(id: Number | undefined) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/product-images/${id}`, requestOptions)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return false;
            }
        });

    return res;
}

async function CreateImage(formData: FormData,id: Number | undefined) {
    const requestOptions = {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    };
  
    let res = await fetch(`${apiUrl}/product-image/${id}`, requestOptions).then(
      (res) => {
        if (res.status == 201) {
          return res.json();
        } else {
          return false;
        }
      }
    );
  
    return res;
  }

  async function UpdateImage(formData: FormData, id: number) {
    if (!id) {
        console.error('Image ID is required to update');
        return false;
    }

    const requestOptions = {
        method: "PUT",
        body: formData,
    };

    try {
        const res = await fetch(`${apiUrl}/product-image/${id}`, requestOptions);
        if (res.status === 200) {
            return await res.json();
        } else {
            console.error("Failed to update image:", res.status, res.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error occurred while updating image:', error);
        return false;
    }
}




// Fetch filtered products
async function GetFilteredProducts(brandId?: string, categoryId?: string): Promise<ProductInterface[] | false> {
    const query = new URLSearchParams();
    if (brandId) query.append('brand', brandId);
    if (categoryId) query.append('category', categoryId);

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(`${apiUrl}/products?${query.toString()}`, requestOptions);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to fetch filtered products:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return false;
    }
}





  

export {
    CreateProduct,
    ListProducts,
    GetProductByID,
    UpdateProduct,
    DeleteProductByID,
    GetFilteredProducts,

    GetBrands,

    GetCategories,

    GetOwner,
    GetOwnerById,
    
    ListImages,
    GetImageByProductID,   
    CreateImage,
    UpdateImage

}