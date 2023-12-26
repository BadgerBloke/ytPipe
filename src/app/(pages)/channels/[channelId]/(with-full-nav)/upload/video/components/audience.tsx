import { ControllerRenderProps } from 'react-hook-form';

import { IconExclamationCircle } from '@tabler/icons-react';

import Tooltip from '~/components/atom/tooltip';
import Typography from '~/components/atom/typography';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { buttonVariants } from '~/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { cn } from '~/lib/utils';

import { UploadVideoFormType } from '../schemas/upload-video';

interface AudienceProps {
    contentForKidsField: ControllerRenderProps<UploadVideoFormType, 'contentForKids'>;
    ageRestrictionField: ControllerRenderProps<UploadVideoFormType, 'ageRestriction'>;
}

const Audience: React.FC<AudienceProps> = ({ contentForKidsField, ageRestrictionField }) => {
    return (
        <div>
            <div className="flex flex-col gap-2">
                <Typography variant="small">Audience</Typography>
                <Typography variant="muted" className="text-xs font-light text-foreground">
                    This video is set to {contentForKidsField.value === 'no' && 'not'} made for kids{' '}
                    <span className="rounded-md bg-foreground px-1 py-[2px] text-[10px] font-medium leading-[10px] text-background shadow-sm">
                        SET BY YOU
                    </span>
                </Typography>
                <Typography variant="muted" className="text-xs font-light">
                    <span className="mr-2">
                        Regardless of your location, you&apos;re legally required to comply with the Children&apos;s Online
                        Privacy Protection Act (COPPA) and/or other laws. You&apos;re required to tell us whether your videos
                        are made for kids.
                    </span>
                    <a
                        href="https://support.google.com/youtube/answer/9528076?hl=en"
                        rel="noreferrer noopener"
                        target="_blank"
                        className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
                    >
                        What&apos;s content made for kids?
                    </a>
                </Typography>
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 shadow-md">
                    <IconExclamationCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <Typography variant="muted" className="text-xs font-light">
                        <span className="mr-2">
                            Features like personalized ads and notifications won&apos;t be available on videos made for kids.
                            Videos that are set as made for kids by you are more likely to be recommended alongside other
                            kids&apos; videos.
                        </span>
                        <a
                            href="https://support.google.com/youtube/answer/9527654?hl=en"
                            rel="noreferrer noopener"
                            target="_blank"
                            className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
                        >
                            Learn more
                        </a>
                    </Typography>
                </div>
                <FormItem className="mt-2 space-y-2">
                    <FormControl>
                        <RadioGroup
                            onValueChange={contentForKidsField.onChange}
                            defaultValue={contentForKidsField.value}
                            className="flex flex-col space-y-2"
                        >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">Yes, It&apos;s made for kids</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">No, It&apos;s not made for kids</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <Accordion type="single" collapsible className="mt-4 w-full">
                    <AccordionItem
                        value="item-1"
                        className="space-y-2 rounded-md border-none transition-all duration-300 ease-in-out radix-state-open:bg-muted radix-state-open:px-4 radix-state-open:pt-4"
                    >
                        <AccordionTrigger className="flex-row-reverse justify-end gap-2 p-0 hover:no-underline">
                            Age restriction (advanced)
                        </AccordionTrigger>
                        <AccordionContent>
                            <Typography variant="muted">Do you want to restrict your video to an adult audience?</Typography>
                            <Typography variant="muted" className="text-xs font-light">
                                <span className="mr-2">
                                    Age-restricted videos are not shown in certain areas of YouTube. These videos may have
                                    limited or no ads monetization.
                                </span>
                                <a
                                    href="https://support.google.com/youtube/answer/2950063?hl=en"
                                    rel="noreferrer noopener"
                                    target="_blank"
                                    className={cn(buttonVariants({ variant: 'link' }), 'h-fit p-0 text-xs text-brand')}
                                >
                                    Learn more
                                </a>
                            </Typography>
                            <Tooltip
                                message="This question is disabled because the video has been set as made for kids."
                                hidden={contentForKidsField.value === 'no'}
                            >
                                <FormItem className="mt-3 space-y-2">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={ageRestrictionField.onChange}
                                            defaultValue={ageRestrictionField.value}
                                            className="flex flex-col space-y-2"
                                            value={contentForKidsField.value === 'yes' ? 'no' : ageRestrictionField.value}
                                            disabled={contentForKidsField.value === 'yes'}
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="yes" className="peer" />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer font-normal peer-disabled:text-muted-foreground">
                                                    Yes, restrict my video to viewers over 18
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="no" className="peer" />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer font-normal peer-disabled:text-muted-foreground">
                                                    No, don&apos;t restrict my video to viewers over 18 only
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </Tooltip>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default Audience;
