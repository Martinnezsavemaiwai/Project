package entity

import "gorm.io/gorm"

type Owner struct {
   
   gorm.Model
   Prefix		string

   FirstName string   

   LastName  string  

   AdminRole string

   Email     string

   Password  string

   ProfilePath	string
  
   // 1 Owner สามารถมีหลาย Category
   Categories []Category `gorm:"foreignKey:OwnerID"`
}
