import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const name = createCategoryDto.name;
    const CategoryExists = await this.categoryRepo.findOne({ where: { name } });
    if (CategoryExists) {
      throw new ConflictException('Category Already Exists');
    }
    const newCategory = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(newCategory);
  }

  async findAll() {
    const categories = await this.categoryRepo.find();
    return { categories };
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const updateCategory = Object.assign(category, updateCategoryDto);
    return this.categoryRepo.save(updateCategory);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    category.isActive = false;
    await this.categoryRepo.save(category);
    return `${category.name} deleted successfully`;
  }
}
