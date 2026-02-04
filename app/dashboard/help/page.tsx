"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, FileText } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Help Center
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Get support and answers to common questions.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <CardTitle className="text-lg">Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Read our detailed guides on how to interpret analysis results.
                        </p>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">View Guides &rarr;</a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <MessageCircle className="w-8 h-8 text-emerald-500 mb-2" />
                        <CardTitle className="text-lg">Live Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Chat with our support team manually for quick help.
                        </p>
                        <a href="#" className="text-sm font-medium text-emerald-600 hover:underline">Start Chat &rarr;</a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Mail className="w-8 h-8 text-purple-500 mb-2" />
                        <CardTitle className="text-lg">Email Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Send us an email and we'll get back to you within 24 hours.
                        </p>
                        <a href="mailto:support@rivallens.com" className="text-sm font-medium text-purple-600 hover:underline">Contact Us &rarr;</a>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How often can I run an analysis?</AccordionTrigger>
                        <AccordionContent>
                            You can run as many analyses as your credit balance allows. Free tier users get 3 credits per month.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How accurate is the traffic data?</AccordionTrigger>
                        <AccordionContent>
                            We use AI to estimate traffic patterns based on public signals. While not 100% precise, it provides a strong relative comparison.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I export the reports?</AccordionTrigger>
                        <AccordionContent>
                            Yes, you can export reports to PDF or CSV using the download button on the report page (Premium feature).
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
