import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { PatchUserDTO } from "./dto/patch-user.dto";
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {

    }

    async create(data: CreateUserDTO) {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);

        return await this.prisma.user.create({ data })
    }

    async getAll() {
        return await this.prisma.user.findMany();
    }

    async getById(id: number) {
        await this.existsId(id)
        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, { email, name, password, birthAt, role }: UpdateUserDTO) {
        await this.existsId(id)

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        return this.prisma.user.update({
            data: { email, name, password, birthAt: new Date(birthAt), role },
            where: {
                id
            }
        })
    }
    async updatePartial(id: number, { email, name, password, birthAt, role }: PatchUserDTO) {

        await this.existsId(id)

        const data: any = {}

        if (birthAt) {
            data.birthAt = new Date(birthAt)
        }
        if (email) {
            data.email = email
        }
        if (name) {
            data.name = name
        }
        if (password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }
        if (role) {
            data.role = role
        }
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        })
    }

    async delete(id: number) {

        await this.existsId(id)
        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    async existsId(id: number) {
        if (!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`O id: ${id} não foi encontrado`)
        }
    }
}