# User Management System Scripts

This directory contains utility scripts for the User Management System.

## User Registration Script

The `register-user.ts` script allows you to register a new user directly from the command line.

### Usage

```bash
# Using npm script
npm run register-user <email> <password> [name]

# Using ts-node directly
npx ts-node scripts/register-user.ts <email> <password> [name]
```

### Examples

```bash
# Register a user with email and password
npm run register-user user@example.com Password123!

# Register a user with email, password, and name
npm run register-user user@example.com Password123! "John Doe"
```

### Notes

- The password must be at least 8 characters long
- If no name is provided, the script will use the part of the email before the @ symbol as the name
- The user will be created with the default role of "user"
- The script will check if a user with the provided email already exists before creating a new one
- The script will log the registration activity in the ActivityLog table 