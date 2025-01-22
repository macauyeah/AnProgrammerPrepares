# Spring Boot 09 - 設計Database的選擇: Code First Database First 混合使用
# draft
h2 一定會code first

dev profile - code first
uat, prod profile - db first

dev => uat, prod - by diff tools generate patch script

hibernate, numberic (precision, scale) , date (temporal type), string (use_nationalized_character_data = true, length)