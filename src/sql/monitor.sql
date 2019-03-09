CREATE DATABASE monitor

CREATE TABLE monitor.frontend(day Date DEFAULT toDate(its),endpoint UInt32,its UInt32,metric String,submetric String,value Float32,page String,browser String,protocol String,system String,_cnt UInt32 DEFAULT 1) ENGINE=MergeTree(day, (endpoint, day), 8192)

insert into frontend (endpoint, its, metric, submetric, page, browser, protocol, system) values(1, 1551516361, 'performance', 'fps', 'https://b1anker.com', 'Chrome 72', 'https', 'Mac OS 10.14')