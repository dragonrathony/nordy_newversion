/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.3.15-MariaDB : Database - nordy
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`nordy` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `nordy`;

/*Table structure for table `adm_processes` */

DROP TABLE IF EXISTS `adm_processes`;

CREATE TABLE `adm_processes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `cost` double NOT NULL,
  `simulation` enum('1','0') NOT NULL DEFAULT '1',
  `status` enum('1','0') NOT NULL DEFAULT '1',
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `adm_processes` */

/*Table structure for table `batch_simulation` */

DROP TABLE IF EXISTS `batch_simulation`;

CREATE TABLE `batch_simulation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `simulation_name` varchar(200) NOT NULL,
  `orders` int(11) NOT NULL,
  `product_code` varchar(200) NOT NULL,
  `quantity` double NOT NULL,
  `icms` double NOT NULL,
  `pis` double NOT NULL,
  `cofins` double NOT NULL,
  `comission` double DEFAULT NULL,
  `shipment` double NOT NULL,
  `margin` double NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`,`simulation_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `batch_simulation` */

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(200) NOT NULL,
  `address` varchar(200) NOT NULL,
  `neighborhood` varchar(200) NOT NULL,
  `zipcode` varchar(100) NOT NULL,
  `city` varchar(200) NOT NULL,
  `state` varchar(200) NOT NULL,
  `phone` varchar(200) NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `customers` */

/*Table structure for table `family` */

DROP TABLE IF EXISTS `family`;

CREATE TABLE `family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `family_name` varchar(200) NOT NULL,
  `family_name_com` varchar(100) DEFAULT NULL,
  `family_name_desc` text DEFAULT NULL,
  `process_id` int(11) NOT NULL,
  `process_order` int(11) NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `family` */

/*Table structure for table `ind_process` */

DROP TABLE IF EXISTS `ind_process`;

CREATE TABLE `ind_process` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `process_name` varchar(100) NOT NULL,
  `shift_a` double DEFAULT NULL,
  `shift_b` double DEFAULT NULL,
  `shift_c` double DEFAULT NULL,
  `shift_d` double DEFAULT NULL,
  `shift_e` double DEFAULT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '0' COMMENT '1: active, 0: deactive',
  `extra` longtext DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`,`process_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `ind_process` */

/*Table structure for table `op_post_params` */

DROP TABLE IF EXISTS `op_post_params`;

CREATE TABLE `op_post_params` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `op_post_id` int(11) NOT NULL,
  `quality` double NOT NULL,
  `efficiency` double NOT NULL,
  `availability` double NOT NULL,
  `setup_time` double NOT NULL,
  `setup_time_unity` varchar(100) NOT NULL,
  `cost` double NOT NULL,
  `cost_time_unity` varchar(100) NOT NULL,
  `setup_loss` double NOT NULL,
  `setup_loss_unity` varchar(100) NOT NULL,
  `speed` double NOT NULL,
  `speed_unity` varchar(100) NOT NULL,
  `speed_time_unity` varchar(100) NOT NULL,
  `min_batch` double NOT NULL,
  `min_batch_unity` varchar(100) NOT NULL,
  `max_batch` double NOT NULL,
  `max_batch_unity` varchar(100) NOT NULL,
  `group_speed` double NOT NULL,
  `group_speed_time_unity` varchar(100) NOT NULL,
  `group_speed_unity` varchar(100) NOT NULL,
  `group_name` varchar(100) NOT NULL,
  `status` enum('1','0') NOT NULL DEFAULT '1',
  `shift_a` double NOT NULL,
  `shift_b` double NOT NULL,
  `shift_c` double NOT NULL,
  `shift_d` double NOT NULL,
  `shift_e` double NOT NULL,
  `extra` longtext DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `op_post_params` */

/*Table structure for table `op_posts` */

DROP TABLE IF EXISTS `op_posts`;

CREATE TABLE `op_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `machine_name` varchar(200) NOT NULL,
  `machine_code` varchar(200) NOT NULL,
  `ind_process_id` int(11) NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `op_posts` */

/*Table structure for table `product_body` */

DROP TABLE IF EXISTS `product_body`;

CREATE TABLE `product_body` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_header_id` int(11) NOT NULL,
  `product_char_father_id` int(11) DEFAULT NULL,
  `product_char_child_id` int(11) DEFAULT NULL,
  `product_char_child_value` double DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8;

/*Data for the table `product_body` */

/*Table structure for table `product_char1` */

DROP TABLE IF EXISTS `product_char1`;

CREATE TABLE `product_char1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_char_father_id` int(11) DEFAULT NULL,
  `product_char_father_desc` text DEFAULT NULL,
  `family_name` varchar(100) NOT NULL,
  `disabled` enum('1','0') DEFAULT '0',
  `divider` text DEFAULT NULL,
  `grid_columns` int(11) DEFAULT NULL,
  `grid_sm_columns` int(11) DEFAULT NULL,
  `label` varchar(200) DEFAULT NULL,
  `mask` varchar(200) DEFAULT NULL,
  `max_length` int(11) DEFAULT NULL,
  `min_length` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `property` varchar(200) DEFAULT NULL,
  `required` enum('1','0') DEFAULT '1',
  `type` varchar(100) DEFAULT NULL,
  `visible` enum('1','0') DEFAULT '1',
  `options` text DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `product_char1` */

/*Table structure for table `product_char2` */

DROP TABLE IF EXISTS `product_char2`;

CREATE TABLE `product_char2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_char_father_id` int(11) DEFAULT NULL,
  `product_child_id` int(11) DEFAULT NULL,
  `product_child_desc` text DEFAULT NULL,
  `product_child_nick_name` text DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `product_char2` */

/*Table structure for table `product_head` */

DROP TABLE IF EXISTS `product_head`;

CREATE TABLE `product_head` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(200) NOT NULL,
  `family_name` varchar(100) NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`,`product_code`),
  UNIQUE KEY `product_code` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Data for the table `product_head` */

/*Table structure for table `quotation_body` */

DROP TABLE IF EXISTS `quotation_body`;

CREATE TABLE `quotation_body` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `header_id` int(11) DEFAULT NULL,
  `process_name` varchar(200) DEFAULT NULL,
  `time` double DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `quotation_body` */

/*Table structure for table `quotation_head` */

DROP TABLE IF EXISTS `quotation_head`;

CREATE TABLE `quotation_head` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icms` double DEFAULT NULL,
  `pis` double DEFAULT NULL,
  `cofins` double DEFAULT NULL,
  `comission` double DEFAULT NULL,
  `shipment` double DEFAULT NULL,
  `margin` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `due_date` varchar(100) DEFAULT NULL,
  `client` varchar(100) DEFAULT NULL,
  `login` int(11) DEFAULT NULL,
  `date_quotation` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_order` datetime DEFAULT NULL,
  `product_code` varchar(200) DEFAULT NULL,
  `formula_cost` double DEFAULT NULL,
  `formula_code` varchar(100) DEFAULT NULL,
  `units` double DEFAULT NULL,
  `kg` double DEFAULT NULL,
  `m` double DEFAULT NULL,
  `m2` double DEFAULT NULL,
  `m3` double DEFAULT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `quotation_head` */

/*Table structure for table `structure` */

DROP TABLE IF EXISTS `structure`;

CREATE TABLE `structure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formula_code` varchar(100) NOT NULL,
  `formula_cost` double NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `structure` */

/*Table structure for table `user_role` */

DROP TABLE IF EXISTS `user_role`;

CREATE TABLE `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `user_role` */

insert  into `user_role`(`id`,`role_name`) values (1,'Super admin'),(2,'Admin'),(3,'Financial'),(4,'Factory'),(5,'Salesperson external'),(6,'Salesperson internal');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `rold_id` int(11) NOT NULL,
  `bu` int(11) NOT NULL,
  PRIMARY KEY (`id`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`rold_id`,`bu`) values (1,'test','123',1,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
