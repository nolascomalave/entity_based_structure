import { Entity } from "../../../../domain/entities/entity/entity";
import { RegisterEntityUseCase } from "./register-entity.use-case";
import { EntityRepository } from "../ports/entity.repository";

describe("RegisterEntityUseCase", () => {
    let useCase: RegisterEntityUseCase,
        mockRepo: jest.Mocked<EntityRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findById: jest.fn(),
        };
        useCase = new RegisterEntityUseCase(mockRepo);
    });

    it('should create and save a valid entity', async () => {
        const input = {
          system_subscription_id: crypto.randomUUID(),
          is_natural: false,
          name: 'Acme Corp',
        };

        const output = await useCase.execute(input);

        expect(output.name).toBe('Acme Corp');
        expect(output.id).toBeDefined();
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        const savedEntity: Entity = mockRepo.save.mock.calls[0][0];
        expect(savedEntity.name).toBe(input.name);
        /* expect(savedEntity.system_subscription_id instanceof UUID).toBe(true);
        expect(savedEntity.system_subscription_id.toString()).toBe(input.system_subscription_id); */
        expect(savedEntity.system_subscription_id).toEqual(expect.objectContaining({ value: input.system_subscription_id }));
        expect(savedEntity.is_natural).toBe(input.is_natural);
    });

    it('should throw if name is empty', async () => {
        const input = {
        system_subscription_id: crypto.randomUUID(),
          is_natural: false,
          name: '   ',
        };

        await expect(useCase.execute(input)).rejects.toThrow('The name of this entity is required.');
        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});