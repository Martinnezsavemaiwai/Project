package entity

import (

	"gorm.io/gorm"
)


type Product struct {
   gorm.Model

   ProductName string

   Description  string    

   PricePerPiece     float32   

   Stock       uint

   // 1 Owner สามารถมีหลาย Category
   Images []Image `gorm:"foreignKey:ProductID"`

   // CategoryID ทำหน้าที่เป็น Foreign Key
   CategoryID  uint 
   Category Category `gorm:"foreignKey:CategoryID"`

   // BrandID ทำหน้าที่เป็น Foreign Key
   BrandID uint 
   Brand Brand `gorm:"foreignKey:BrandID"`

}
