package entity

import "gorm.io/gorm"

type Brand struct {
   
    gorm.Model

    BrandName string

    ImagePath		string

   // 1 Brand สามารถมีหลาย Product
    Products  []Product `gorm:"foreignKey:BrandID"`
}
