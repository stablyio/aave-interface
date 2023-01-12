import { InterestRate } from '@aave/contract-helpers';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { ArrowNarrowRightIcon, CheckIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import { IncentivesCard } from 'src/components/incentives/IncentivesCard';
import { IsolatedBadge } from 'src/components/isolationMode/IsolatedBadge';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { NoData } from 'src/components/primitives/NoData';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { ComputedUserReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MigrationDisabled, V3Rates } from 'src/store/v3MigrationSelectors';

interface MigrationListMobileItemProps {
  checked: boolean;
  amount: string;
  amountInUSD: string;
  onCheckboxClick: () => void;
  disabled?: MigrationDisabled;
  enabledAsCollateral?: boolean;
  canBeEnforced?: boolean;
  enableAsCollateral?: () => void;
  isIsolated?: boolean;
  borrowApyType?: string;
  userReserve: ComputedUserReserveData;
  v3Rates?: V3Rates;
}

export const MigrationListMobileItem = ({
  checked,
  amount,
  amountInUSD,
  onCheckboxClick,
  enabledAsCollateral,
  disabled,
  enableAsCollateral,
  isIsolated,
  borrowApyType,
  userReserve,
  v3Rates,
}: MigrationListMobileItemProps) => {
  const v2APY = borrowApyType
    ? borrowApyType === InterestRate.Stable
      ? userReserve.stableBorrowAPY
      : userReserve.reserve.variableBorrowAPY
    : userReserve.reserve.supplyAPY;
  const v2Incentives = borrowApyType
    ? borrowApyType === InterestRate.Stable
      ? userReserve.reserve.sIncentivesData
      : userReserve.reserve.vIncentivesData
    : userReserve.reserve.aIncentivesData;
  const v3APY = borrowApyType ? v3Rates?.variableBorrowAPY || '-1' : v3Rates?.supplyAPY || '-1';
  const v3Incentives = borrowApyType
    ? v3Rates?.vIncentivesData || []
    : v3Rates?.aIncentivesData || [];

  return (
    <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pl: 2, py: 2 }}>
        <ListColumn align="left" maxWidth={40} minWidth={40}>
          <Box
            sx={(theme) => ({
              border: `2px solid ${
                Boolean(disabled) ? theme.palette.action.disabled : theme.palette.text.secondary
              }`,
              background: checked ? theme.palette.text.secondary : theme.palette.background.paper,
              width: 16,
              height: 16,
              borderRadius: '2px',
              cursor: Boolean(disabled) ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
            onClick={Boolean(disabled) ? undefined : onCheckboxClick}
          >
            <SvgIcon sx={{ fontSize: '14px', color: 'background.paper' }}>
              <CheckIcon />
            </SvgIcon>
          </Box>
        </ListColumn>

        <ListColumn align="left">
          <Row>
            <TokenIcon symbol={userReserve.reserve.iconSymbol} fontSize="large" />

            <Box sx={{ pl: 3.5, overflow: 'hidden' }}>
              <Typography variant="h4" noWrap>
                {userReserve.reserve.symbol}
              </Typography>
            </Box>
          </Row>
        </ListColumn>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12 }}>
        <Typography variant="description" color="text.secondary">
          <Trans>Current v2 Balance</Trans>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
            <FormattedNumber value={amount} variant="secondary14" />
          </Box>
          <FormattedNumber
            value={amountInUSD}
            variant="secondary12"
            color="text.secondary"
            symbol="USD"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12, pt: 2 }}>
        <Typography variant="description" color="text.secondary">
          <Trans>APY change</Trans>
        </Typography>
        <ListColumn align="right">
          <Box sx={{ display: 'flex' }}>
            <IncentivesCard
              value={v2APY}
              symbol={userReserve.reserve.symbol}
              incentives={v2Incentives}
              variant="main14"
            />
            <SvgIcon sx={{ px: 1.5 }}>
              <ArrowNarrowRightIcon fontSize="14px" />
            </SvgIcon>
            <IncentivesCard
              value={v3APY}
              symbol={userReserve.reserve.symbol}
              incentives={v3Incentives}
              variant="main14"
            />
          </Box>
        </ListColumn>
      </Box>

      {!!enableAsCollateral && (
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12, pb: 2 }}
        >
          <Typography variant="description" color="text.secondary">
            <Trans>Collateral change</Trans>
          </Typography>
          <ListColumn align="right">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {userReserve.usageAsCollateralEnabledOnUser &&
              userReserve.reserve.usageAsCollateralEnabled ? (
                <CheckRoundedIcon fontSize="small" color="success" />
              ) : (
                <NoData variant="main14" color="text.secondary" />
              )}

              <SvgIcon sx={{ px: 1.5 }}>
                <ArrowNarrowRightIcon fontSize="14px" />
              </SvgIcon>
              {!enabledAsCollateral ? (
                <NoData variant="main14" color="text.secondary" />
              ) : isIsolated ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <SvgIcon sx={{ color: 'warning.main', fontSize: '20px' }}>
                    <ExclamationCircleIcon />
                  </SvgIcon>
                  <IsolatedBadge />
                </Box>
              ) : (
                <CheckRoundedIcon fontSize="small" color="success" />
              )}
            </Box>
          </ListColumn>
        </Box>
      )}

      {!!borrowApyType && (
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pl: 12, py: 2 }}
        >
          <Typography variant="description" color="text.secondary">
            <Trans>APY type change</Trans>
          </Typography>
          <ListColumn align="right">
            <Box sx={{ display: 'flex' }}>
              <Button variant="outlined" size="small" sx={{ width: '50px', background: 'white' }}>
                <Typography variant="buttonS" color="primary">
                  {borrowApyType}
                </Typography>
              </Button>
              <SvgIcon sx={{ px: 1.5 }}>
                <ArrowNarrowRightIcon fontSize="14px" />
              </SvgIcon>
              <Button variant="outlined" size="small" sx={{ width: '50px', background: 'white' }}>
                <Typography variant="buttonS" color="primary">
                  Variable
                </Typography>
              </Button>
            </Box>
          </ListColumn>
        </Box>
      )}
    </ListItem>
  );
};
