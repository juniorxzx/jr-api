import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { PatchUserDTO } from "./dto/patch-user.dto";
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data)

    }

    @Roles(Role.Admin)
    @Get()
    async list() {
        return this.userService.getAll();
    }

    @Roles(Role.Admin)
    @Get(':id')
    async show(@ParamId() id: number) {
        console.log({ id })
        return this.userService.getById(id)
    }


    @Roles(Role.Admin)
    @Put(':id')
    async update(@Body() data: UpdateUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data)
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async updatePartial(@Body() data: PatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data)
    }

    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id)
    }
}