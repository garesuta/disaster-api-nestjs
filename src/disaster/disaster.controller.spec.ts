import { Test, TestingModule } from '@nestjs/testing';
import { DisasterController } from './disaster.controller';
import { DisasterService } from './disaster.service';

describe('DisasterController', () => {
  let controller: DisasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisasterController],
      providers: [DisasterService],
    }).compile();

    controller = module.get<DisasterController>(DisasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
