const db = require("./db.service");

const createProvince = (name, code) =>
  db.query(`INSERT INTO province (name,code) VALUES (? ,?)`, [name, code]);

const getProvinces = () => db.query("SELECT * FROM province");

const createDistrict = (name, code, province_id) =>
  db.query(`INSERT INTO district (name,code,province_id) VALUES (? ,?,?)`, [
    name,
    code,
    province_id,
  ]);

const getDistricts = () =>
  db.query(
    "SELECT D.name as name, D.code as code,D.id as id FROM district as D "
  );

const createCommune = (name, code, district_id) =>
  db.query(`INSERT INTO commune (name,code,district_id) VALUES (? ,?,?)`, [
    name,
    code,
    district_id,
  ]);

const getCommunes = () =>
  db.query(
    " SELECT C.name as name, C.code as code,C.id as id FROM commune as C"
  );

const getAddress = () =>
  db.query(`
  select * ,(select json_arrayagg(
	json_object(
		'id',D.id,
		'name',D.name,
		'code',D.code,
        'commune',(
			select json_arrayagg(
				json_object(
					'id',C.id,
					'name',C.name,
	             	'code',C.code
                )
            ) from commune as C WHERE C.district_id = D.id
        )
    )
)  from district as D where D.province_id = P.id ) as district from province as P;

`);
module.exports = {
  createProvince,
  getProvinces,
  createDistrict,
  getDistricts,
  createCommune,
  getCommunes,
  getAddress,
};
