import { Employee } from '../types';

const departments = ['技术部', '产品部', '设计部', '市场部', '销售部', '人力资源部', '财务部', '行政部'];
const levels = ['P5', 'P6', 'P7', 'P8', 'M1', 'M2', 'M3'];
const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高'];
const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '涛', '明', '超', '秀兰', '霞', '平'];

function generateName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return firstName + lastName;
}

function generateEmployee(id: number): Employee {
  const hasAddress = Math.random() > 0.2;
  const deptIndex = Math.floor(Math.random() * departments.length);
  const levelIndex = Math.floor(Math.random() * levels.length);
  
  return {
    id: `emp${id}`,
    name: generateName(),
    department: departments[deptIndex],
    level: levels[levelIndex],
    email: `emp${id}@company.com`,
    phone: `13800138${String(100 + id).padStart(3, '0')}`,
    address: hasAddress
      ? {
          province: '上海市',
          city: '上海市',
          district: ['浦东新区', '黄浦区', '徐汇区', '静安区', '长宁区'][Math.floor(Math.random() * 5)],
          detail: `某某路${Math.floor(Math.random() * 1000)}号${Math.floor(Math.random() * 30)}号楼${Math.floor(Math.random() * 20)}0${Math.floor(Math.random() * 9)}室`,
          zipCode: `2000${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
          receiverName: generateName(),
          receiverPhone: `13900139${String(100 + id).padStart(3, '0')}`,
        }
      : null,
    addressComplete: hasAddress,
    avatar: `https://i.pravatar.cc/100?img=${(id % 70) + 1}`,
  };
}

export const mockEmployees: Employee[] = Array.from({ length: 50 }, (_, i) => generateEmployee(i + 1));

export const departmentsList = ['全部部门', ...departments];
export const levelsList = ['全部级别', ...levels];
