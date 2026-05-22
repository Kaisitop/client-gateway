import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE,  } from '../config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'createOrder' }, createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const order = await firstValueFrom( this.client.send({ cmd: 'findAllOrders' }, orderPaginationDto))
      return order
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'findOneOrder' }, { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findOrderByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginatioDto: PaginationDto,
  ) {
    try {
      return this.client.send(
        { cmd: 'findAllOrders' },
        {
          ...paginatioDto,
          status: statusDto.status,
        },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send({cmd: 'changeOrderStatus'}, {id, status: statusDto.status})
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
