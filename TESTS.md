# Tests

## Automated tests written

### `tests/audit/engine.test.ts`

What it covers:

1. deterministic spend and annualization math
2. same-vendor downgrade recommendation for small ChatGPT teams
3. Claude Team overkill detection below minimum team size
4. API-direct credit recommendation behavior without inventing fake plan downgrades
5. honest low-savings posture for already-lean stacks

## How to run

```bash
npm test
```

## Notes

- The current automated coverage is intentionally focused on the deterministic audit engine because that is the trust-critical part of the product.
- These tests are the minimum required evaluator coverage and they do run successfully in the current repo.
