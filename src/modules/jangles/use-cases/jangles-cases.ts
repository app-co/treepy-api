/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { jangle, Prisma } from '@prisma/client';

import { IJangleUpdate } from '../dtos';
import { JangleAlredyExist } from '../errors/JangleAlredyExist';
import { JangleNotFound } from '../errors/JangleNotFound';
import { IRepoJangles } from '../repositories/repo-jangles';

interface props {
  id: string;
}

export class JanglesUseCases implements IRepoJangles {
  constructor(private repoJangles: IRepoJangles) {}

  async create(data: Prisma.jangleUncheckedCreateInput): Promise<jangle> {
    const find = await this.repoJangles.findByCodigo(data.codigo);

    if (find) {
      throw new JangleAlredyExist();
    }
    const dt = {
      ...data,
      project_value: Number(data.project_value),
      tree_media_value: Number(data.tree_media_value),
      quantity_tree: Number(data.quantity_tree),
      tree: Number(data.tree),
    };

    const create = await this.repoJangles.create(dt);

    await prisma.caches.create({
      data: {
        fk_jangle_id: create.id,
        treepeycash: create.tree,
      },
    });

    await prisma.cashe_jangle.create({
      data: {
        fk_jangle_id: create.id,
      },
    });

    return create;
  }

  async findById(id: string): Promise<jangle | null> {
    const find = await this.repoJangles.findById(id);

    if (!find) {
      throw new JangleNotFound();
    }

    return find;
  }

  async findByCodigo(codigo: string): Promise<jangle | null> {
    const find = await this.repoJangles.findById(codigo);

    if (!find) {
      throw new JangleNotFound();
    }

    return find;
  }

  async listall(): Promise<jangle[]> {
    const list = await this.repoJangles.listall();

    return list;
  }

  async delete(id: string): Promise<jangle> {
    const del = await this.repoJangles.delete(id);
    return del;
  }

  async update(data: IJangleUpdate): Promise<jangle> {
    const up = await this.repoJangles.update(data);

    return up;
  }
}
