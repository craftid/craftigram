# CraftiGram | A MERN + TypeScript Stack Instagram Clone

CraftiGram is a full-stack Instagram clone built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript. This project demonstrates a modern web application with real-time features, user authentication, and CRUD operations.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete posts
- Like and comment on posts
- Follow and unfollow users
- Real-time notifications
- Responsive design with Tailwind CSS

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Real-time**: Socket.IO
- **Build Tools**: Vite, Docker
- **Linting and Formatting**: ESLint, Prettier

## Prerequisites

- Node.js >= 20
- npm >= 7
- pnpm >= 9.12
- MongoDB >= 6

## Installation

1. Clone the repository:

```sh
git clone <repository-url> <directory>
cd <directory>
```

2. Install dependencies:

```sh
pnpm install
```

3. Copy the example environment variables file and set up Cloudinary:

```sh
cp /server/.env.local.example /server/.env
```

Edit the `.env` file to include your Cloudinary credentials, MongoDB URL, and JWT secret:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

## Running the application

### Local (for docker skip this)

#### Development

To start the development server for both client and server:

```sh
pnpm run dev
```

#### Production

To build the application for production

```sh
pnpm run build
```

To start the application in production mode

```sh
pnpm run start
```

### Docker

#### Development

```sh
pnpm run docker:dev
```

#### Production

```sh
pnpm run docker:prod
```

## License

This project is licensed under the ISC License.

Enjoy building with CraftiGram! 🚀
