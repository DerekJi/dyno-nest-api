import { ApiPropertyOptions } from "@nestjs/swagger"

export const UserApiOptions = new Map<string, ApiPropertyOptions>();

UserApiOptions.set('name', { required: true, example: 'Your Full Name', description: 'The full name of the user, including first name and surname' });
UserApiOptions.set('email', { required: true, example: 'sample@domain.com', description: 'The email of the user' });
UserApiOptions.set('role', { required: false, default: 'USER', example: 'USER', description: 'The role name of the user' });

