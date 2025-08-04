import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../modules/user/constants/role.enum';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    constructor() { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramId = request.params.id;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        const isAdmin = user.role === Role.ADMIN;
        const isSelf = user.id == paramId;

        if (isAdmin || isSelf) {
            return true;
        }

        throw new ForbiddenException('You can only access your own data or require admin role');
    }
}
