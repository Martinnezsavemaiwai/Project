package entity

import "gorm.io/gorm"

type Category struct {

   gorm.Model
   
   CategoryName string 

   ImagePath		string
   
   // OwnerID ทำหน้าที่เป็น Foreign Key
   OwnerID  uint
   Owner    Owner  `gorm:"foreignKey:OwnerID"`

   // 1 Category สามารถมีหลาย Products
   Products []Product `gorm:"foreignKey:CategoryID"`
}
