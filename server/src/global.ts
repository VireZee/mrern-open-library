import mongoose, { Schema } from 'mongoose'
import express from 'express'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'
globalThis.mongoose = mongoose
globalThis.Schema = Schema
globalThis.express = express
globalThis.nodeCrypto = crypto
globalThis.GraphQLError = GraphQLError
export {}