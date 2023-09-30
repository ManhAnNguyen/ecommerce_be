import Commune from "../entity/Commune";
import District from "../entity/District";
import Province from "../entity/Province";
import AppError from "../errors/AppError";
import {
  communeRepository,
  districtRepository,
  provinceRepository,
} from "../repositories";

class AddressService {
  //province
  async createProvince(code: string, name: string) {
    if (!code || !name) throw new AppError("code and name are required", 400);
    const province = new Province();
    province.code = code;
    province.name = name;
    await provinceRepository.save(province);
  }

  async getProvince() {
    const data = await provinceRepository.find({
      relations: {
        districts: true,
      },
    });

    return data;
  }

  //district

  async getDistrict() {
    const data = await districtRepository.find({
      relations: {
        province: true,
        communes: true,
      },
    });

    return data;
  }

  async createDistrict(name: string, code: string, province_code: string) {
    if (!province_code || !name || !code)
      throw new AppError("province_code,name,code are required", 400);
    const province = await provinceRepository.findOneBy({
      code: province_code,
    });

    console.log(province);

    if (!province) throw new AppError("province not found", 404);
    const district = new District();
    district.code = code;
    district.name = name;
    district.province = province;

    await districtRepository.save(district);
  }

  //commune

  async createCommune(name: string, code: string, district_code: string) {
    if (!district_code || !name || !code)
      throw new AppError("district_code,name,code are required", 400);

    const district = await districtRepository.findOneBy({
      code: district_code,
    });

    if (!district) throw new AppError("district not found", 404);

    const commune = new Commune();
    commune.code = code;
    commune.name = name;
    commune.district = district;

    await communeRepository.save(commune);
  }

  async getCommnue() {
    const data = await communeRepository.find({
      relations: {
        district: true,
      },
    });

    return data;
  }

  //address
  async getAddress() {
    const data = await provinceRepository.find({
      relations: {
        districts: {
          communes: true,
        },
      },
    });

    return data;
  }
}

export default AddressService;
