import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export class QueryBuilderUtil {
  static applyPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number,
  ): SelectQueryBuilder<T> {
    const skip = (page - 1) * limit;
    return queryBuilder.skip(skip).take(limit);
  }

  static applySorting<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    sortParam?: string,
    alias?: string,
  ): SelectQueryBuilder<T> {
    if (!sortParam) return queryBuilder;

    const sorts = sortParam.split(',');
    sorts.forEach((sort) => {
      const [field, order] = sort.split(':');
      const orderDirection = order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      const column = alias ? `${alias}.${field}` : field;
      queryBuilder.addOrderBy(column, orderDirection);
    });

    return queryBuilder;
  }

  static applySearch<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string,
    fields: string[],
    alias?: string,
  ): SelectQueryBuilder<T> {
    if (!searchTerm || fields.length === 0) return queryBuilder;

    const conditions = fields.map((field) => {
      const column = alias ? `${alias}.${field}` : field;
      return `${column} LIKE :search`;
    });

    return queryBuilder.andWhere(`(${conditions.join(' OR ')})`, {
      search: `%${searchTerm}%`,
    });
  }

  static applyFilters<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: Record<string, unknown>,
    alias?: string,
  ): SelectQueryBuilder<T> {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const column = alias ? `${alias}.${key}` : key;
        queryBuilder.andWhere(`${column} = :${key}`, { [key]: value });
      }
    });

    return queryBuilder;
  }
}
